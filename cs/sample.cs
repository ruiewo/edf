using NAudio.Wave;
using System;
using System.Collections.Concurrent;
using System.Threading;

namespace AudioMixerApp
{
    public class AudioInput
    {
        private WaveInEvent waveIn;
        private ConcurrentQueue<byte[]> audioQueue = new ConcurrentQueue<byte[]>();
        private bool isCapturing;

        public event Action<byte[]> OnAudioCaptured;

        public void StartCapture(int deviceNumber = 0)
        {
            waveIn = new WaveInEvent { DeviceNumber = deviceNumber };
            waveIn.WaveFormat = new WaveFormat(44100, 1); // 44.1kHz, モノラル
            waveIn.DataAvailable += (s, a) =>
            {
                audioQueue.Enqueue(a.Buffer);
                OnAudioCaptured?.Invoke(a.Buffer);
            };
            isCapturing = true;
            waveIn.StartRecording();
        }

        public void StopCapture()
        {
            isCapturing = false;
            waveIn.StopRecording();
            waveIn.Dispose();
        }

        public bool TryGetAudio(out byte[] audioData)
        {
            return audioQueue.TryDequeue(out audioData);
        }

        public static void ListInputDevices()
        {
            for (int i = 0; i < WaveIn.DeviceCount; i++)
            {
                var deviceInfo = WaveIn.GetCapabilities(i);
                Console.WriteLine($"Input Device {i}: {deviceInfo.ProductName}");
            }
        }
    }

    public class AudioPlayer
    {
        private AudioFileReader audioFileReader;
        private IWavePlayer waveOut;
        private byte[] playbackBuffer;
        private int bufferSize = 4096; // バッファサイズ

        public void LoadFile(string filePath)
        {
            audioFileReader = new AudioFileReader(filePath);
            waveOut = new WaveOutEvent();
            waveOut.Init(audioFileReader);
            playbackBuffer = new byte[bufferSize];
        }

        public void Play()
        {
            waveOut.Play();
        }

        public void Stop()
        {
            waveOut.Stop();
        }

       public byte[] GetPlaybackData()
        {
            if (waveOut.PlaybackState == PlaybackState.Playing)
            {
                int bytesRead = audioFileReader.Read(playbackBuffer, 0, playbackBuffer.Length);
                if (bytesRead > 0)
                {
                    byte[] outputBuffer = new byte[bytesRead];
                    Array.Copy(playbackBuffer, outputBuffer, bytesRead);
                    return outputBuffer;
                }
            }
            return null; // 再生中でないか、データがない場合
        }
    }

    public class AudioMixer
    {
        public byte[] Mix(byte[] inputAudio, byte[] playbackAudio)
        {
            int length = Math.Min(inputAudio.Length, playbackAudio.Length);
            byte[] mixedAudio = new byte[length];

            for (int i = 0; i < length; i++)
            {
                mixedAudio[i] = (byte)Math.Min(inputAudio[i] + playbackAudio[i], 255);
            }

            return mixedAudio;
        }
    }

    public class AudioOutput
    {
        private IWavePlayer waveOut;

        public void Output(byte[] mixedAudio, int deviceNumber = 0)
        {
            // 指定されたデバイス番号のWaveOutEventを作成
            waveOut = new WaveOutEvent { DeviceNumber = deviceNumber };

            using (var ms = new MemoryStream(mixedAudio))
            {
                var waveStream = new RawSourceWaveStream(ms, new WaveFormat(44100, 1));
                waveOut.Init(waveStream);
                waveOut.Play();
            }
        }

        public static void ListOutputDevices()
        {
            for (int i = 0; i < WaveOut.DeviceCount; i++)
            {
                var deviceInfo = WaveOut.GetCapabilities(i);
                Console.WriteLine($"Device {i}: {deviceInfo.ProductName}");
            }
        }
    }

    public class AudioMixerApp
    {
        private AudioInput audioInput;
        private AudioPlayer audioPlayer;
        private AudioMixer audioMixer;
        private AudioOutput audioOutput;

        public AudioMixerApp()
        {
            audioInput = new AudioInput();
            audioPlayer = new AudioPlayer();
            audioMixer = new AudioMixer();
            audioOutput = new AudioOutput();
        }

        public void Start()
        {
            audioInput.StartCapture();
            // 音声再生ファイルをロード
            audioPlayer.LoadFile("path_to_audio_file.wav");

            // 再生を開始
            audioPlayer.Play();

            // リアルタイム処理スレッド
            new Thread(() =>
            {
                while (true)
                {
                    if (audioInput.TryGetAudio(out byte[] inputAudio))
                    {
                        byte[] playbackAudio = audioPlayer.GetPlaybackData();
                        
                        // 再生中の音声データが存在する場合のみミキシングを行う
                        if (playbackAudio != null)
                        {
                            byte[] mixedAudio = audioMixer.Mix(inputAudio, playbackAudio);
                            audioOutput.Output(mixedAudio);
                        }
                        else
                        {
                            // 再生が終了した場合、音声出力を停止する処理を追加
                            audioPlayer.Stop();
                        }
                    }

                    Thread.Sleep(10); // CPU使用率を下げるためのスリープ
                }
            }).Start();
        }

        public void Stop()
        {
            audioInput.StopCapture();
            audioPlayer.Stop();
        }
    }
}