# main.tf

# Elastic Beanstalk Application
resource "aws_elastic_beanstalk_application" "hackathon" {
  name        = "hackathon"
  description = "Hackathon Final Destination"
}

# Elastic Beanstalk Environment
resource "aws_elastic_beanstalk_environment" "hackathon-env" {
  name                = "hackathon-env"
  application         = aws_elastic_beanstalk_application.hackathon.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.1.0 running Python 3.9"

  setting {
    namespace = "aws:elasticbeanstalk:container:python"
    name      = "WSGIPath"
    value     = "run.py"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "Port"
    value     = "5000"
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "LogPublicationControl"
    value     = "true"
  }

  setting {
    namespace = "aws:elasticbeanstalk:hostmanager"
    name      = "LogPublicationControl"
    value     = "true"
  }

  setting {
    namespace = "aws:elasticbeanstalk:command"
    name      = "LogLevel"
    value     = "DEBUG"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.ebs_instance_profile.name
  }
}
