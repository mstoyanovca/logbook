import play.sbt.PlayRunHook
import sbt._

import scala.sys.process.Process

object FrontEndRunHook {
  def apply(base: File): PlayRunHook = {
    object UIBuildHook extends PlayRunHook {
      var process: Option[Process] = None

      // Change these commands if you want to use Yarn.
      var npmInstall: String = FrontEndCommands.dependencyInstall
      var npmRun: String = FrontEndCommands.serve

      if (System.getProperty("os.name").toLowerCase().contains("win")) {
        npmInstall = "cmd /c" + npmInstall
        npmRun = "cmd /c" + npmRun
      }

      override def beforeStarted(): Unit = {
        if (!(base / "ui" / "node_modules").exists()) Process(npmInstall, base / "ui").!
      }

      override def afterStarted(): Unit = {
        process = Option(
          Process(npmRun, base / "ui").run
        )
      }

      override def afterStopped(): Unit = {
        process.foreach(_.destroy())
        process = None
      }
    }

    UIBuildHook
  }
}
