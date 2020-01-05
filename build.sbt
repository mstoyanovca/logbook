name := "va3aui"
version := "19.12.1-SNAPSHOT"
scalaVersion := "2.12.10"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "front-end" ** "*").get
)

libraryDependencies ++= Seq(
  guice,
  "com.pauldijou" %% "jwt-play" % "4.2.0",
  "mysql" % "mysql-connector-java" % "8.0.18",
  "com.typesafe.slick" %% "slick" % "3.3.1",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.3.1",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0"
)
