﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace demo_site.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            this.ViewData["inspectMode"] = HttpContext.Request.Query["analyze"] == "true";
        }
    }
}