using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace demo_site
{
    public class Chat : Hub
    {
        public static Dictionary<string, int> selectors = new Dictionary<string, int>();
        public static List<object> positions = new List<object>();

        public static Dictionary<string, int> oldSelectors = new Dictionary<string, int>();
        public static List<object> oldPositions = new List<object>();
        public static Action updateTime;

        public async Task Inspect(bool old)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, old ? "old" : "new");
            await Clients.Caller.SendAsync("echo", old ? oldSelectors : selectors, old ? oldPositions : positions);
        }

        public void Echo(string name, string message)
        {
            Clients.Client(Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
        }

        public async void Click(string user, Dictionary<string, object> position)
        {
            string selector = position["selector"].ToString();
            selectors[selector] = selectors.ContainsKey(selector) ? selectors[selector] + 1 : 1;
            positions.Add(position);
            await Clients.Group("new").SendAsync("echo", selector, position);
            
            
            await Task.Delay(30000);
            
            positions.Remove(position);
            oldPositions.Add(position);
            selectors[selector] -= 1;
            if (selectors[selector] == 0)
            {
                selectors.Remove(selector);
            }
            oldSelectors[selector] = oldSelectors.ContainsKey(selector) ? oldSelectors[selector] + 1 : 1;

            updateTime?.Invoke();

            await Task.Delay(30000);
            oldPositions.Remove(position);
            
            oldSelectors[selector] -= 1;
            if (oldSelectors[selector] == 0)
            {
                oldSelectors.Remove(selector);
            }

            updateTime?.Invoke();
        }
    }
}