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

