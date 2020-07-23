# VPC
resource "aws_vpc" "tokyo_metro_network_vpc" {
    cidr_block = "10.1.0.0/16"
    instance_tenancy = "default"
    tags = {
        Name = "tokyo_metro_netrowk_vpc"
    }
}

# InternetGateway
resource "aws_internet_gateway" "tokyo_metro_network_internet_gateway" {
  vpc_id = aws_vpc.tokyo_metro_network_vpc.id
}

# RouteTable
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.tokyo_metro_network_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tokyo_metro_network_internet_gateway.id
  }
  tags = {
    Name = "public"
  }
}

# Subnets
resource "aws_subnet" "public_a" {
  vpc_id = aws_vpc.tokyo_metro_network_vpc.id
  cidr_block = "10.1.1.0/24"
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "public-a"
  }
}

# SubnetRouteTableAssociation
resource "aws_route_table_association" "public_a" {
    subnet_id = aws_subnet.public_a.id
    route_table_id = aws_route_table.public.id
}
