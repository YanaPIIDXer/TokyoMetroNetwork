# ========= TASK ============

# API
resource "aws_ecs_task_definition" "tmn_ecs_task_api" {
    family = "tmn_ecs_task"
    requires_compatibilities = ["EC2"]
    cpu    = "256"
    memory = "256"

    network_mode = "bridge"

    container_definitions = <<EOL
    [
        {
            "name": "api",
            "image": "yanap/tokyo_metro_network_api",
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
    family = "tmn_ecs_task"
    requires_compatibilities = ["EC2"]
    cpu    = "256"
    memory = "256"

    network_mode = "bridge"

    container_definitions = <<EOL
    [
        {
            "name": "api",
            "image": "yanap/tokyo_metro_network-route_map",
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
