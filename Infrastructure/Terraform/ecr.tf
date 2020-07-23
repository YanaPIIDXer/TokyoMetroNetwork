resource "aws_ecr_repository" "tokyo_metro_network_repos" {
    name = "tokyo_metro_netrowk"
    image_tag_mutability = "MUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }
}
