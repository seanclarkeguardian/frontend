package controllers

import com.gu.openplatform.contentapi.model.ItemResponse
import common._
import conf._
import model._
import play.api.mvc.{ Content => _, _ }
import play.api.libs.concurrent.Akka
import play.api.Play.current

case class ArticlePage(content: Content, storyPackage: List[Trail], edition: String)

object ArticleController extends Controller with Logging {

  def render(path: String) = Action { implicit request =>
    val promiseOfArticle = Akka.future(lookup(path))
    Async {
      promiseOfArticle.map {
        case Left(model) if model.content.isExpired => Gone(Compressed(views.html.expired(model.content)))
        case Left(model) => renderArticle(model)
        case Right(notFound) => notFound
      }
    }
  }

  private def lookup(path: String)(implicit request: RequestHeader) = suppressApi404 {
    val edition = Site(request).edition
    log.info("Fetching article: " + path + " for edition " + edition)
    val response: ItemResponse = ContentApi.item(path, edition)
      .showExpired(true)
      .showTags("all")
      .showFields("all")
      .tag("type/interactive")
      .response

    log.info(response.toString)

    val articleOption = response.content.map { new Content(_) }
    val storyPackage = response.storyPackage map { new Content(_) }

    val model = articleOption.map { article => ArticlePage(article, storyPackage.filterNot(_.id == article.id), edition) }
    ModelOrResult(model, response)
  }

  private def renderArticle(model: ArticlePage)(implicit request: RequestHeader): Result =
    request.getQueryString("callback").map { callback =>
      JsonComponent(views.html.fragments.articleBody(model.content))
    } getOrElse {
      Cached(model.content)(
        Ok(Compressed(views.html.article(model.content, model.storyPackage, model.edition)))
      )
    }
}
