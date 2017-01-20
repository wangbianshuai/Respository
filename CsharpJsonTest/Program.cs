using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;

namespace JsonTest
{
    class Program
    {
        static void Main(string[] args)
        {
            string json = "[{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"},{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"}]";

            json = "{\"LoginName\":\"admin\",\"UserTypes\":[1,2,3,4],\"LoginPassword\":\"admin\",\"UserList\":" + json + "}";


            Stopwatch sh = new Stopwatch();

            sh.Start();
            var list = JsonParse.DictionaryTo<LoginRequest>(json);
            sh.Stop();

            Console.WriteLine("JsonParse耗时:" + sh.ElapsedMilliseconds);

            Stopwatch sh2 = new Stopwatch();
            sh2.Start();
            var list2 = JsonConvert.DeserializeObject<LoginRequest>(json);
            sh2.Stop();
            Console.WriteLine("JsonConvert耗时:" + sh.ElapsedMilliseconds);

            Console.WriteLine(json);

            Console.ReadLine();
        }
    }
}
