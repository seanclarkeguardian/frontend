package model
import org.joda.time.DateTime

case class Event(
  chainId: String,
  id: String,
  startDate: DateTime,
  title: String,
  content: Seq[StoryTrail])

case class StoryTrail(
  foo: String, 
  sectionName: String,
  webPublicationDate: DateTime,
  linkText: String, //webTitle
  url: String, //webUrl
  trailText: Option[String],
  headline: String,
  isLive: Boolean,
  thumbnail: Option[String] = None) extends Trail { }

object Events {
  val australianOpen = Event(
    "debeb4eb-c51f-4df6-997b-893a5e7fa4f7",
    "/world/event/2013/jan/25/australian-open-andy-murray-roger-federer",
    "2013-01-22T12:15:00Z".parseISODateTimeNoMillis,
    "Obama's inauguration",
    Seq(
      StoryTrail(
        "sport",
        "Sport",
        "2013-01-25T11:20:33Z".parseISODateTimeNoMillis,
        "Andy Murray v Roger Federer: Australian Open semi-final – live! | Katy Murrells",
        "http://www.guardian.co.uk/sport/2013/jan/25/andy-murray-roger-federer-live",
        Option("<p><strong>Game-by-game report:</strong> Will Andy Murray finally overcome Roger Federer in a grand slam match? Find out with Katy Murrells</p>"),
        "Andy Murray v Roger Federer: Australian Open semi-final – live!",
        true,
        Option("http://static.guim.co.uk/sys-images/Sport/Pix/pictures/2013/1/23/1358952696980/Murray-and-Federer-001.jpg")
      ),
      StoryTrail(
        "sport",
        "Sport",
        "2013-01-25T10:47:56Z".parseISODateTimeNoMillis,
        "Andy Murray v Roger Federer: Australian Open semi-final - in pictures",
        "http://www.guardian.co.uk/sport/gallery/2013/jan/25/australian-open-2013-australian-open",
        Option("<p>All the best images as Andy Murray takes on Roger Federer for a place in this year's Australian Open final</p>"),
        "Andy Murray v Roger Federer: Australian Open semi-final - in pictures",
        false,
        Option("http://static.guim.co.uk/sys-images/Sport/Pix/pictures/2013/1/25/1359109951411/Roger-Federer-hits-a-retu-003.jpg")
      ),
      StoryTrail(
        "sport",
        "Sport",
        "2013-01-24T07:37:40Z".parseISODateTimeNoMillis,
        "Victoria Azarenka and Li Na to meet in Australian Open final",
        "http://www.guardian.co.uk/sport/2013/jan/24/azarenka-li-na-australian-open",
        Option("<p>The defending champion Victoria Azarenka ended the run of Sloane Stephens, while Li Na stunned Maria Sharapova 6-2, 6-2</p>"),
        "Victoria Azarenka and Li Na to meet in Australian Open final",
        false,
        Option("http://static.guim.co.uk/sys-images/Sport/Pix/pictures/2013/1/24/1359012371587/Li-Na-003.jpg")
      ),
      StoryTrail(
        "sport",
        "Sport",
        "2013-01-24T14:44:31Z".parseISODateTimeNoMillis,
        "Australian Open diary 2013: Victoria Azarenka's torment of the timeout",
        "http://www.guardian.co.uk/sport/2013/jan/24/australian-open-diary-victoria-azarenka",
        Option("<strong>Kevin Mitchell: </strong>Did the defending champion really have to leave the court a set and 5-4 up for a medical timeout, having just dropped serve and looking vulnerable against the rampant Sloane Stephens?"),
        "Australian Open diary 2013: Victoria Azarenka's torment of the timeout",
        false,
        Option("http://static.guim.co.uk/sys-images/Sport/Pix/pictures/2013/1/24/1359038554462/Victoria-Azarenka-tennis--003.jpg")
      )
    )
  )
}
