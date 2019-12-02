name := "va3aui"
version := "19.11.1-SNAPSHOT"
scalaVersion := "2.12.10"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "front-end" ** "*").get
)

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"

libraryDependencies ++= Seq(
  filters,
  jdbc,
  ehcache,
  ws,
  specs2 % Test,
  guice,
  "com.pauldijou" %% "jwt-core" % "4.2.0",
  "com.pauldijou" %% "jwt-play" % "4.2.0",
  "com.auth0" % "jwks-rsa" % "0.9.0")

unmanagedResourceDirectories in Test += baseDirectory(_ / "target/web/public/test").value
