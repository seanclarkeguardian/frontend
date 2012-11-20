// Additional information on initialization
logLevel := Level.Warn

resolvers ++= Seq(
  "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/",
  "Templemore Repository" at "http://templemore.co.uk/repo",
  Classpaths.typesafeResolver
)

addSbtPlugin("play" % "sbt-plugin" % "play-2.1-RC1")

addSbtPlugin("com.typesafe.sbtscalariform" % "sbtscalariform" % "0.4.0")

addSbtPlugin("templemore" %% "xsbt-cucumber-plugin" % "0.5.0")