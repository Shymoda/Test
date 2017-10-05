using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MinimalApp.Controllers
{
   public class HomeController : Controller
   {
        public IActionResult Index()
        {

            return View();
        }

        public JsonResult Data()
        {
            var events = new List<Events>();

            using (ReactContext rc = new ReactContext())
            {
                 events = rc.Events.ToList();
            }

            return Json(events);
        }

        public JsonResult DeleteEvent(int id)
        {
            var events = new List<Events>();

            using (ReactContext rc = new ReactContext())
            {
                Events tmp = new Events { Id = id };

                rc.Events.Remove(tmp);

                rc.SaveChanges();

                events = rc.Events.ToList();
            }

            return Json(events);
        }
   }
}
