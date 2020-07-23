# ========= TASK ============

variable "api_image_uri" {}
variable "route_map_image_uri" {}

# API
resource "aws_ecs_task_definition" "tmn_ecs_task_api" {
    family = "tmn_ecs_task_api"
    requires_compatibilities = ["EC2"]
    cpu    = "256"
    memory = "256"

    network_mode = "bridge"

    container_definitions = <<EOL
    [
        {
            "name": "api",
            "image": "${var.api_image_uri}",
            "portMappings": [
                {
                    "containerPort": 80,
                    "hostPort": 3000
                }
            ]
        }
    ]
    EOL
}

# API
resource "aws_ecs_task_definition" "tmn_ecs_task_route_map" {
    family = "tmn_ecs_task_route_map"
    requires_compatibilities = ["EC2"]
    cpu    = "256"
    memory = "256"

    network_mode = "bridge"

    container_definitions = <<EOL
    [
        {
            "name": "api",
            "image": "${var.route_map_image_uri}",
            "portMappings": [
                {
                    "containerPort": 80,
                    "hostPort": 3000
                }
            ]
        }
    ]
    EOL
}

# ============ SECURITY =================

# SecurityGroup
resource "aws_security_group" "tmn_security_group" {
  name = "tmn_security_group"
  vpc_id = aws_vpc.tokyo_metro_network_vpc.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "tmn_security_group"
  }
}

# SecurityGroup Rule
resource "aws_security_group_rule" "tmn_seculity_group_rule" {
  security_group_id = aws_security_group.tmn_security_group.id
  type = "ingress"
  from_port = 80
  to_port   = 80
  protocol  = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}

# ============= ECS =================

# ECS Cluster
resource "aws_ecs_cluster" "tokyo_metro_network_ecs_cluster" {
    name = "tmn_ecs_cluster"
}

# ECS
resource "aws_ecs_service" "tokyo_metro_network_ecs" {
    name = "tokyo_metro_network_ecs"
    cluster = aws_ecs_cluster.tokyo_metro_network_ecs_cluster.id
    launch_type = "EC2"
    desired_count = 1
    task_definition = aws_ecs_task_definition.tmn_ecs_task_api.id
    network_configuration {
        subnets = [aws_subnet.public_a.id]
        security_groups = [aws_security_group.tmn_security_group.id]
    }
}
