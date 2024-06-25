# iam.tf

resource "aws_iam_role" "ebs_instance_role" {
  name = "ebs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ebs_instance_role_policy" {
  role       = aws_iam_role.ebs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_instance_profile" "ebs_instance_profile" {
  name = "ebs-instance-profile"
  role = aws_iam_role.ebs_instance_role.name
}
