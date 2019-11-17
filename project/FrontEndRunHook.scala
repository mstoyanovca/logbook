import play.sbt.PlayRunHook
import sbt._

import scala.sys.process.Process

object FrontEndRunHook {
  def apply(base: File): PlayRunHook = {
    object UIBuildHook extends PlayRunHook {
      var process: Option[Process] = None

      var npmInstall: String = FrontEndCommands.dependencyInstall
      var npmRun: String = FrontEndCommands.serve

      if (System.getProperty("os.name").toLowerCase().contains("win")) {
        npmInstall = "cmd /c" + npmInstall
        npmRun = "cmd /c" + npmRun
      }

      override def beforeStarted(): Unit = {
        if (!(base / "front-end" / "node_modules").exists()) Process(npmInstall, base / "front-end").!
      }

      override def afterStarted(): Unit = {
        process = Option(
          Process(npmRun, base / "front-end").run
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
