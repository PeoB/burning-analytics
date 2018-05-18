using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;

namespace demo_site
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseMvc();
            app.UseFileServer();
            var hubContext = app.ApplicationServices.GetService<IHubContext<Chat>>();
            Chat.updateTime = () =>
            {
                hubContext.Clients.Group("new").SendAsync("echo", Chat.selectors, Chat.positions);
                hubContext.Clients.Group("old").SendAsync("echo", Chat.oldSelectors, Chat.oldPositions);
            };
            app.UseCors(
                builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials().Build());
            app.UseSignalR(routes => { routes.MapHub<Chat>("/chat"); });
        }
    }
}