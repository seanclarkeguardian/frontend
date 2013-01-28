package controllers

import common._
import play.api.mvc.{ Action, Controller }
import model._

object StoryPackageController extends Controller with Logging {

  def render(id: String) = Action { implicit request =>

    /* Logic here to get event from api */

    val event = Events.australianOpen

    Cached(60) {
      val html = views.html.fragments.storyPackage(event)
      request.getQueryString("callback").map { callback =>
        JsonComponent(html)
      } getOrElse {
        Cached(60) {
          Ok(Compressed(html))
        }
      }
    }
  }
}
