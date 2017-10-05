using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace MinimalApp.Controllers
{
   public class HomeController : Controller
   {
        List<Events> events = new List<Events>();

        public IActionResult Index()
        {

            return View();
        }

        public JsonResult Data()
        {

            try
            {

                using (ReactContext rc = new ReactContext())
                {
                    events = rc.Events.ToList();
                }

                return Json(events);
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }

        public JsonResult DeleteEvent(int id)
        {

            try
            {
                using (ReactContext rc = new ReactContext())
                {
                    Events tmp = new Events { Id = id };

                    rc.Events.Remove(tmp);

                    rc.SaveChanges();

                    events = rc.Events.ToList();
                }

                return Json(events);
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }

        public JsonResult AddEvent(string evt, string time)
        {
            string pattern = @"(2[0-3]|[0-1]\d):[0-5]\d";

            try
            {

                using (ReactContext rc = new ReactContext())
                {
                    Events ev = new Events { Event = evt, Time = time };

                    Regex regex = new Regex(pattern);

                    if (regex.IsMatch(ev.Time))
                        rc.Events.Add(ev);
                    else
                        throw new Exception("Недопустимый формат даты!");

                    rc.SaveChanges();

                    events = rc.Events.ToList();
                }

                return Json(events);
            }
            catch(Exception ex)
            {
                return Json(ex);
            }
        }

        public JsonResult ChangeEvent(string ids, string time)
        {
            try
            {
                String[] idElems = ids.Split('_');

                using (ReactContext rc = new ReactContext())
                {
                    events = rc.Events.ToList();

                    foreach (Events ev in events)
                    {
                        if (idElems.Contains(ev.Id.ToString()))
                            ev.Time = time;
                    }

                    rc.SaveChanges();
                }

                return Json(events);
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }
   }
}
