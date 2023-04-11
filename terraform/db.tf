# TODO: keys in makefile profile
provider "aws" {
  region     = "us-east-1"
}

resource "aws_dynamodb_table" "tokens_rate_limit" {
  name = "TokensRateLimit"

  attribute {
    name = "token"
    type = "S"
  }

  attribute {
    name = "expires_at"
    type = "N"
  }

  hash_key = "token"

  billing_mode = "PAY_PER_REQUEST"

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
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })
}
