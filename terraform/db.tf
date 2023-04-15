provider "aws" {
  region  = "us-east-1" # your aws_region
  access_key = var.access_key # keys    from
  secret_key = var.secret_key # env-config.tf
}

resource "aws_dynamodb_table" "tokens_rate_limit" {
  name = "TokensRateLimit" # table name

  attribute {
    name = "token"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "expires_at"
    type = "N"
  }

  hash_key     = "token"
  billing_mode = "PAY_PER_REQUEST"

  global_secondary_index {
    name                 = "email"
    hash_key             = "email"
    projection_type      = "ALL"
  }

  global_secondary_index {
    name                 = "expiresAtIndex"
    hash_key             = "expires_at"
    range_key            = "token"
    projection_type      = "ALL"
  }

  ttl {
    attribute_name      = "expires_at"
    enabled             = true
  }

  tags = {
    Environment = "production"
  }
}

resource "aws_iam_role" "event_target_role" {
  name = "event_target_role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "dynamodb_policy" {
  name        = "DynamoDBAccessPolicy"
  description = "Policy for allowing access to DynamoDB table"

  policy      = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action   = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
        ]
        Effect   = "Allow"
        Resource = [
          aws_dynamodb_table.tokens_rate_limit.arn,
          "${aws_dynamodb_table.tokens_rate_limit.arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "event_target_role_dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.dynamodb_policy.arn
  role       = aws_iam_role.event_target_role.name
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_role_dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.dynamodb_policy.arn
  role       = aws_iam_role.lambda_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_role_execution_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}
