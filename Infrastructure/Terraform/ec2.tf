resource "aws_instance" "tokyo-metro-network" {
  count         = 1
  ami           = "ami-785c491f"
  instance_type = "t2.micro"

  tags = {
    Name = "tokyo-metro-network"
  }
}
