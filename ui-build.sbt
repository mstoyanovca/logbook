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

lazy val `ui-test` = TaskKey[Unit]("Run UI tests when testing application.")

`ui-test` := {
  implicit val userInterfaceRoot: File = baseDirectory.value / "ui"
  if (executeUiTests != Success) throw new Exception("UI tests failed!")
}

lazy val `ui-prod-build` = TaskKey[Unit]("Run UI build when packaging the application.")

`ui-prod-build` := {
  implicit val userInterfaceRoot: File = baseDirectory.value / "ui"
  if (executeProdBuild != Success) throw new Exception("Oops! UI Build crashed.")
}

dist := (dist dependsOn `ui-prod-build`).value

stage := (stage dependsOn `ui-prod-build`).value

test := ((test in Test) dependsOn `ui-test`).value
