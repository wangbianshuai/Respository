using Autofac;
using System;
using System.Threading;

namespace Marriage.ComputeMarriageMakePair
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var startup =new Startup();
                var container= startup.ConfigureContainer();

                Application.IMarriageMakePair marriageMakePair = container.Resolve<Application.IMarriageMakePair>();

                ComputeMarriageMakePair(marriageMakePair);

                Thread.Sleep(1000 * 10);
            }
            catch (Exception ex)
            {
                Utility.LoggerProxy.Exception("ComputeMarriageMakePair", "Main", ex);
            }
        }

        static void ComputeMarriageMakePair(Application.IMarriageMakePair marriageMakePair)
        {
            marriageMakePair.ComputeMarriageMakePair(new Entity.Application.MarriageMakePair.ComputeMarriageMakePairRequest());
        }
    }
}
