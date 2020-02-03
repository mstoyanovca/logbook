name := "va3aui"
version := "20.2.1-SNAPSHOT"
scalaVersion := "2.13.1"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "front-end" ** "*").get
)

libraryDependencies ++= Seq(
  ws,
  guice,
  "com.pauldijou" %% "jwt-play" % "4.2.0",
  "mysql" % "mysql-connector-java" % "8.0.18",
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % "test",
  "org.mockito" % "mockito-core" % "3.2.4" % Test
)
