using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading;

namespace EntityDataService.Service
{
    public class AsyncAction
    {
        public static IAsyncResult Run(Action action)
        {
            IAsyncResult asyncResult = action.BeginInvoke(AysncActionCallback, null);
            ThreadPool.RegisterWaitForSingleObject(
              asyncResult.AsyncWaitHandle,
              AysncActionCompleteCallback,
              new List<object>() { asyncResult },
              1800000,
              true);

            return asyncResult;
        }

        private static void AysncActionCallback(IAsyncResult result)
        {
            Action d = (Action)((AsyncResult)result).AsyncDelegate;
            d.EndInvoke(result);
        }

        private static void AysncActionCompleteCallback(object state, bool isTimeout)
        {
            try
            {
                List<object> stateList = state as List<object>;
                IAsyncResult result = stateList[0] as IAsyncResult;

                if (isTimeout)
                {
                    if (!result.IsCompleted)
                    {
                        result.AsyncWaitHandle.Close();
                    }
                }
            }
            catch
            {
            }
        }
    }
}
