resource "aws_ecr_repository" "tokyo_metro_network_api_repo" {
    name = "yanap/tokyo_metro_netrowk_api"
    image_tag_mutability = "MUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }
}

resource "aws_ecr_repository" "tokyo_metro_network_route_map_repo" {
    name = "yanap/tokyo_metro_netrowk_route-map"
    image_tag_mutability = "MUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }
}
