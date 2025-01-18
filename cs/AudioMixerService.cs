using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using System;
using System.Collections.Generic;

public class AudioMixerService : IDisposable
{
    private readonly WaveInEvent waveIn;
    private readonly WaveOutEvent waveOut;
    private readonly MixingSampleProvider mixer;
    private readonly float mixerVolume = 1.0f;
    private bool isInitialized = false;

    // 再生中の音声ファイルを管理するリスト
    private readonly List<WaveFileReader> activeFiles = new();

    public AudioMixerService()
    {
        try
        {
            // マイク入力の設定
            waveIn = new WaveInEvent
            {
                WaveFormat = WaveFormat.CreateIeeeFloatWaveFormat(44100, 1),
                // WaveFormat = new WaveFormat(44100, 16, 1), // 44.1kHz, 16bit, モノラル
                BufferMilliseconds = 50 // バッファサイズ（調整可能）
            };

            // マイク入力用のバッファプロバイダー
            var bufferedProvider = new BufferedWaveProvider(waveIn.WaveFormat);
            // var pcmToFloat = new WaveToSampleProvider(bufferedProvider);

            // ミキサーの設定
            mixer = new MixingSampleProvider(WaveFormat.CreateIeeeFloatWaveFormat(44100, 1));
            mixer.ReadFully = true;

            // マイク入力をミキサーに追加
            // mixer.AddMixerInput(pcmToFloat);
            // mixer.AddMixerInput(new SampleToWaveProvider(mixer));
            var micProvider = new WaveToSampleProvider(bufferedProvider);
            mixer.AddMixerInput(micProvider);

            // 出力デバイスの設定
            waveOut = new WaveOutEvent();
            waveOut.Init(mixer);

            // マイク入力のイベントハンドラー設定
            waveIn.DataAvailable += (s, e) => bufferedProvider.AddSamples(e.Buffer, 0, e.BytesRecorded);

            isInitialized = true;
        }
        catch (Exception ex)
        {
            throw new Exception("オーディオデバイスの初期化に失敗しました", ex);
        }
    }

    // 音声ファイルの再生
    public void PlayAudioFile(string filePath)
    {
        if (!isInitialized) return;

        try
        {
            var audioFile = new WaveFileReader(filePath);
            activeFiles.Add(audioFile);

            // オーディオデータをミキサーと同じフォーマットに変換
            ISampleProvider sampleProvider = audioFile.WaveFormat.Encoding == WaveFormatEncoding.IeeeFloat
                ? new WaveToSampleProvider(audioFile)
                : new Pcm16BitToSampleProvider(audioFile);

            // サンプルレートとチャンネル数をミキサーに合わせる
            if (sampleProvider.WaveFormat.SampleRate != mixer.WaveFormat.SampleRate)
            {
                sampleProvider = new WdlResamplingSampleProvider(sampleProvider, mixer.WaveFormat.SampleRate);
            }

            // ステレオの場合はモノラルに変換
            if (sampleProvider.WaveFormat.Channels != 1)
            {
                sampleProvider = sampleProvider.ToMono();
            }

            var volumeProvider = new VolumeSampleProvider(sampleProvider)
            {
                Volume = mixerVolume
            };

            mixer.AddMixerInput(volumeProvider);
        }
        catch (Exception ex)
        {
            throw new Exception("音声ファイルの再生に失敗しました", ex);
        }
    }

    // 録音・再生の開始
    public void Start()
    {
        if (!isInitialized) return;

        waveIn.StartRecording();
        waveOut.Play();
    }

    // 録音・再生の停止
    public void Stop()
    {
        if (!isInitialized) return;

        waveIn.StopRecording();
        waveOut.Stop();
    }

    // リソースの解放
    public void Dispose()
    {
        Stop();

        waveIn?.Dispose();
        waveOut?.Dispose();

        foreach (var file in activeFiles)
        {
            file?.Dispose();
        }
        activeFiles.Clear();
    }
}