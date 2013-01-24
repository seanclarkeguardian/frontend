package model

case class Event(
  chainId: String,
  id: String,
  startDate: String,
  title: String,
  content: Seq[StoryTrail])

case class StoryTrail(
  webPublicationDate: DateTime,
  linkText: String, //webTitle
  headline: String,
  url: String, //webUrl
  trailText: Option[String],
  section: String, //sectionId
  sectionName: String,
  thumbnail: Option[String] = None,
  isLive: Boolean)

object Events {
  val obamaEvent = Event(
    "debeb4eb-c51f-4df6-997b-893a5e7fa4f7",
    "/world/event/2013/jan/23/obama-inauguration",
    "2013-01-22T12:15:00Z",
    "Obama's inauguration",
    Seq(
      StoryTrail(
        id = "world/2013/jan/22/obama-inauguration-speech-republican-compromise",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-22T22 =10 =21Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama accused of giving partisan inauguration speech",
        url = "http =//www.guardian.co.uk/world/2013/jan/22/obama-inauguration-speech-republican-compromise",
        trailText = "Senator John McCain among Republicans blasting US president for failing to offer a hand across the political divide",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/22/1358892557605/Barack-Obama-2013-preside-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "music/2013/jan/22/beyonce-obama-inauguration-lip-synch",
        section = "music",
        sectionName = "Music",
        webPublicationDate = "2013-01-23T07 =49 =00Z".parseISODateTimeNoMillis,
        linkText = "Marine band confirms Beyoncé lip-synched at Obama inauguration",
        url = "http =//www.guardian.co.uk/music/2013/jan/22/beyonce-obama-inauguration-lip-synch",
        trailText = "<p>Singer joins ranks of Yo-Yo Ma and Whitney Houston after lip- synching her way through rousing rendition of national anthem</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/audio/video/2013/1/22/1358877830169/Beyonc--at-the-Obama-inau-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/obama-sets-goals-unite-inauguration-speech",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-22T08 =10 =00Z".parseISODateTimeNoMillis,
        linkText = "Obama's second inauguration = 'We are made for this moment'",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/obama-sets-goals-unite-inauguration-speech",

        trailText = "<p>President vows to reclaim spirit of founding fathers from conservatives and pledges reform on gay rights, climate change and immigration</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358788544650/1ba810e7-6257-4f87-ba5a-9f2236627c93-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/climate-change-obama-inaugural-address",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T22 =00 =00Z".parseISODateTimeNoMillis,
        linkText = "Climate change moves to forefront in Obama's second inaugural address",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/climate-change-obama-inaugural-address",
        trailText = "<p>President's affirmation of climate science – more prominent than in the campaign – wins praise from environmental groups</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358788919849/759d95b3-6395-4a1c-a412-1445910cb1d0-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/inauguration-2013-obama-sworn-in-live",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T22 =51 =00Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama's second-term inauguration day – as it happened",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/inauguration-2013-obama-sworn-in-live",
        trailText = "<p>Barack Obama is sworn in as US president for the second time and delivers his inaugural address from Washington DC</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358777452844/3f2e4eab-e2b3-48ce-ae14-6c611a8af287-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/20/barack-obama-sworn-in-us-president",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-20T17 =29 =00Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama sworn in for second term as US president",
        url = "http =//www.guardian.co.uk/world/2013/jan/20/barack-obama-sworn-in-us-president",
        trailText = "<p>Televised White House ceremony comes before public celebrations on Monday</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/20/1358702721877/US-President-Barack-Obama-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/barack-obama-2013-inaugural-address",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T17 =15 =00Z".parseISODateTimeNoMillis,
        linkText = "Obama's inaugural address – full text ",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/barack-obama-2013-inaugural-address",
        trailText = "<p>In case you missed it, here's the full text of President Obama's inauguration speech</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358788544650/1ba810e7-6257-4f87-ba5a-9f2236627c93-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/obama-inauguration-history-work-mall",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T19 =15 =00Z".parseISODateTimeNoMillis,
        linkText = "Obama inauguration = 'less about history and more about seeing him get to work'",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/obama-inauguration-history-work-mall",
        trailText = "<p>Crowd on the Mall is smaller than the record numbers of four years ago, but many are just as happy to watch history unfold</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358783071930/6d3eff07-59a0-41bb-86d7-0209a328e7a6-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/michelle-obama-inauguration-day-outfit",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T19 =33 =51Z".parseISODateTimeNoMillis,
        linkText = "Michelle Obama picks designer Thom Browne for inauguration day outfit",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/michelle-obama-inauguration-day-outfit",
        trailText = "No newly-crowned homecoming queen, the first lady looks more like woman with her feet firmly under the White House desk",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358795312889/Obama-inauguration-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/20/barack-obama-inauguration-fundraising",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-20T19 =29 =49Z".parseISODateTimeNoMillis,
        linkText = "Obama turns 'austerity inauguration' into a dash for corporate cash",
        url = "http =//www.guardian.co.uk/world/2013/jan/20/barack-obama-inauguration-fundraising",
        trailText = "<p>President made a point of transparency and capped donations in 2009 but critics say 2013 is dominated by the dollar</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/20/1358709863070/US-President-Barack-Obama-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/18/joe-biden-obama-second-term",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-18T15 =54 =00Z".parseISODateTimeNoMillis,
        linkText = "Joe Biden proves an essential weapon for Obama as he maps out second term",
        url = "http =//www.guardian.co.uk/world/2013/jan/18/joe-biden-obama-second-term",
        trailText = "<p>Biden recasting the role of vice-president – and his long career in Senate is invaluable to the Washington-averse Obama camp</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/About/General/2013/1/1/1357017207482/Joe-Biden-vice-president-002.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "media/2013/jan/22/glenn-beck-misfits-ball-obama-inauguration",
        section = "media",
        sectionName = "Media",
        webPublicationDate = "2013-01-22T00 =05 =21Z".parseISODateTimeNoMillis,
        linkText = "Glenn Beck stages 'misfits ball' in answer to Obama's inauguration",
        url = "http =//www.guardian.co.uk/media/2013/jan/22/glenn-beck-misfits-ball-obama-inauguration",
        trailText = "<p>Tea Party darling invites guests, including Rick Santorum, to join Earth Haters and Bible Thumpers at consolatory dinner</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pixies/2011/7/26/1311636162224/Glenn-Beck-003.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/video/2013/jan/21/barack-obama-inauguration-speech-video",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T22 =33 =37Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama's inauguration speech in full - video",
        url = "http =//www.guardian.co.uk/world/video/2013/jan/21/barack-obama-inauguration-speech-video",
        trailText = "<p>Barack Obama addresses American citizens after being sworn in for a second term as president of the United States</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/audio/video/2013/1/21/1358798675223/Obama-giving-speech-010.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/video/2013/jan/21/obama-inauguration-beyonce-performs-national-anthem-video",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T19 =56 =00Z".parseISODateTimeNoMillis,
        linkText = "Beyoncé sings the national anthem at Obama inauguration - video",
        url = "http =//www.guardian.co.uk/world/video/2013/jan/21/obama-inauguration-beyonce-performs-national-anthem-video",
        trailText = "<p>Beyoncé roused the Washington crowd at Barack Obama's inauguration with a soaring performance of The Star-Spangled Banner</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/audio/video/2013/1/21/1358793072350/Beyonce-singing-at-inaugu-010.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/video/2013/jan/21/obama-sworn-in-second-term-us-president-video",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T11 =28 =06Z".parseISODateTimeNoMillis,
        linkText = "Obama sworn in for second term as US president - video",
        url = "http =//www.guardian.co.uk/world/video/2013/jan/21/obama-sworn-in-second-term-us-president-video",
        trailText = "<p>President Barack Obama is officially sworn in on Sunday for a second term in a small ceremony at the White House</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/audio/video/2013/1/21/1358765964371/Barack-and-Michelle-Obama-010.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "commentisfree/2013/jan/21/barack-obama-stonewall-inaugural-gay-equality",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-21T21 =00 =00Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama's Stonewall moment = an inaugural landmark for gay equality | Jason Farago",
        url = "http =//www.guardian.co.uk/commentisfree/2013/jan/21/barack-obama-stonewall-inaugural-gay-equality",
        trailText = "<p><strong>Jason Farago =</strong> After his first-term ambivalence on gay rights, this was stunning = the president put us squarely in America's struggle for civil rights</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/audio/video/2013/1/21/1358798675223/Obama-giving-speech-010.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "commentisfree/2013/jan/21/obama-inauguration-climate-change",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-21T23 =12 =47Z".parseISODateTimeNoMillis,
        linkText = "Obama inaugurates renewed energy on climate change | Sarah van Gelder",
        url = "http =//www.guardian.co.uk/commentisfree/2013/jan/21/obama-inauguration-climate-change",
        trailText = "<p><strong>Sarah van Gelder =</strong> That the president put climate change so high on his second-term agenda surprised many. But action must follow words</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2012/11/28/1354127870227/54d31374-428e-4336-b24e-2f0c74f1a55c-140.jpeg",
        isLive = "false"
      ),
      StoryTrail(
        id = "commentisfree/2013/jan/21/presidential-inaugurations-american-democracy",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-21T15 =49 =01Z".parseISODateTimeNoMillis,
        linkText = "Presidential inaugurations = American democracy in its glory and shabbiness | Michael Wolff",
        url = "http =//www.guardian.co.uk/commentisfree/2013/jan/21/presidential-inaugurations-american-democracy",
        trailText = "<p><strong>Michael Wolff =</strong> I have only attended one inauguration = Clinton's in 1993. It was a fascinating education in the transactional character of US politics</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/21/1358783041064/Bill-Clintons-inauguratio-003.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "commentisfree/2013/jan/21/obama-inauguration-speech-high-ground",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-21T19 =56 =00Z".parseISODateTimeNoMillis,
        linkText = "Obama shifts to the high ground in call for collective action | Gary Younge",
        url = "http =//www.guardian.co.uk/commentisfree/2013/jan/21/obama-inauguration-speech-high-ground",
        trailText = "<p><strong>Gary Younge =</strong> The president's second address was a better speech than his first – and it showed him at his most combative and idealistic</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/About/General/2013/1/21/1358795889322/Barack-Obama--Second-Term-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/barack-obama-inauguration-style-confident-cool",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T18 =41 =19Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama inauguration style = more confident, greyer, but still cool",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/barack-obama-inauguration-style-confident-cool",
        trailText = "<p>The president stumbled during his oath, but his second-term demeanour, alongside his family, shows he has gained authority</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/About/General/2013/1/21/1358792733890/Barack-Obama-Michell-Obam-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/20/barack-obama-inauguration-day-pomp",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-20T18 =53 =39Z".parseISODateTimeNoMillis,
        linkText = "Obama's inauguration day = all that's missing is the Queen's golden coach",
        url = "http =//www.guardian.co.uk/world/2013/jan/20/barack-obama-inauguration-day-pomp",
        trailText = "<p>Avowedly egalitarian US likes as much pomp and ceremony as it can muster when it proclaims to the world it has chosen</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/20/1358707932520/Barack-Obamas-inauguratio-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "commentisfree/2013/jan/20/american-politics-obama",
        section = "commentisfree",
        sectionName = "Comment is free",
        webPublicationDate = "2013-01-20T20 =26 =34Z".parseISODateTimeNoMillis,
        linkText = "American politics = Obama 2.0",
        url = "http =//www.guardian.co.uk/commentisfree/2013/jan/20/american-politics-obama",
        trailText = "<strong>Editorial = </strong>Obama's most dedicated supporters may hanker for a crisply radical agenda for change, but don't bank on it",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/2013/jan/21/barack-obama-speech-greatest-hits-rhetoric",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T19 =32 =12Z".parseISODateTimeNoMillis,
        linkText = "Barack Obama inauguration speech = a greatest hits of rhetorical tricks",
        url = "http =//www.guardian.co.uk/world/2013/jan/21/barack-obama-speech-greatest-hits-rhetoric",
        trailText = "The president gave a smash-hits selection of oratorical devices, from emphatic anaphora to substantial syntheton",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/About/General/2013/1/21/1358795889322/Barack-Obama--Second-Term-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "environment/2013/jan/21/barack-obama-climate-change",
        section = "environment",
        sectionName = "Environment",
        webPublicationDate = "2013-01-21T15 =56 =00Z".parseISODateTimeNoMillis,
        linkText = "How serious is Barack Obama about climate change?",
        url = "http =//www.guardian.co.uk/environment/2013/jan/21/barack-obama-climate-change",
        trailText = "Five decisions will shed light on whether the president is serious about his pledge to act on global warming in his second term",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/1/1357076067131/Barack-Obama-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/us-news-blog/2013/jan/20/barack-obama-obama-inauguration",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-20T20 =55 =00Z".parseISODateTimeNoMillis,
        linkText = "Obama's in-tray = from gun control to tax, second term will be full of battles",
        url = "http =//www.guardian.co.uk/world/us-news-blog/2013/jan/20/barack-obama-obama-inauguration",
        trailText = "<p><strong>Ewen MacAskill =</strong> As he revels in his second public inauguration, the president knows his legacy lies at the end of a number of perilous paths</p>",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/1/20/1358714986276/Barack-Obama-has-outlined-005.jpg",
        isLive = "false"
      ),
      StoryTrail(
        id = "world/shortcuts/2013/jan/21/inauguration-day-2013-obama-i-did-it",
        section = "world",
        sectionName = "World news",
        webPublicationDate = "2013-01-21T12 =26 =03Z".parseISODateTimeNoMillis,
        linkText = "Inauguration day 2013 = why did Obama say, 'I did it'?",
        url = "http =//www.guardian.co.uk/world/shortcuts/2013/jan/21/inauguration-day-2013-obama-i-did-it",
        trailText = "The US president made a strange remark after taking the oath of office again. What did he mean?",
        thumbnail = "http =//static.guim.co.uk/sys-images/Guardian/About/General/2013/1/21/1358770136748/Barack-Obama-takes-the-oa-007.jpg",
        isLive = "false"
      )))
}
