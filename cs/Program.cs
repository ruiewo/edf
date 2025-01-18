// See https://aka.ms/new-console-template for more information
// Console.WriteLine("Hello, World!");

public class Program
{
    static void Main()
    {
        // var currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var currentDirectory = @$"C:\Users\kalugo\Documents\GitHub\edf\cs";
        // string currentDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        var audioFilePath = Path.Combine(currentDirectory, "example.wav");

        using var mixer = new AudioMixerService();
        mixer.Start();

        Console.WriteLine("マイク入力を開始しました。何かキーを押すと音声ファイルを再生します。");
        Console.WriteLine("終了するには 'q' を押してください。");

        while (true)
        {
            var key = Console.ReadKey(true);
            if (key.KeyChar == 'q')
                break;

            mixer.PlayAudioFile(audioFilePath);
        }
    }
}