import scala.sys.process.Process

val Success = 0
val Error = 1
val isWindows = System.getProperty("os.name").toLowerCase().contains("win")

PlayKeys.playRunHooks += baseDirectory.map(FrontEndRunHook.apply).value

def runOnCommandline(script: String)(implicit dir: File): Int = {
  if (isWindows) {
    Process("cmd /c " + script, dir)
  } else {
    Process(script, dir)
  }
} !

def isNodeModulesInstalled(implicit dir: File): Boolean = (dir / "node_modules").exists()

def runNpmInstall(implicit dir: File): Int = if (isNodeModulesInstalled) Success else runOnCommandline(FrontEndCommands.dependencyInstall)

def ifNodeModulesInstalled(task: => Int)(implicit dir: File): Int = if (runNpmInstall == Success) task else Error

def executeUiTests(implicit dir: File): Int = ifNodeModulesInstalled(runOnCommandline(FrontEndCommands.test))

def executeProdBuild(implicit dir: File): Int = ifNodeModulesInstalled(runOnCommandline(FrontEndCommands.build))

lazy val `front-end-test` = TaskKey[Unit]("Run Front End tests when testing application")

`front-end-test` := {
  implicit val userInterfaceRoot: File = baseDirectory.value / "front-end"
  if (executeUiTests != Success) throw new Exception("Front End tests failed")
}

lazy val `front-end-prod-build` = TaskKey[Unit]("Run Front End build when packaging the application")

`front-end-prod-build` := {
  implicit val userInterfaceRoot: File = baseDirectory.value / "front-end"
  if (executeProdBuild != Success) throw new Exception("Front End Build crashed")
}

dist := (dist dependsOn `front-end-prod-build`).value

stage := (stage dependsOn `front-end-prod-build`).value

test := ((test in Test) dependsOn `front-end-test`).value
