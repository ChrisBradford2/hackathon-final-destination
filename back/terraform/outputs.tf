output "eb_url" {
  value = aws_elastic_beanstalk_environment.hackathon-env.cname
  description = "URL of the Elastic Beanstalk Environment"
}
