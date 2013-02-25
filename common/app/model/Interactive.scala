package model

import com.gu.openplatform.contentapi.model.{ MediaAsset => ApiMedia }

case class Interactive(private val delegate: ApiMedia) {
  private lazy val fields = delegate.fields getOrElse Map.empty[String, String]

  lazy val mediaType: String = delegate.`type`
  lazy val rel: String = delegate.rel
  lazy val index: Int = delegate.index

  lazy val url: Option[String] = delegate.file
  lazy val width: Int = fields.get("width").map(_.toInt).getOrElse(0)
  lazy val height: Int = fields.get("height").map(_.toInt).getOrElse(0)

}
