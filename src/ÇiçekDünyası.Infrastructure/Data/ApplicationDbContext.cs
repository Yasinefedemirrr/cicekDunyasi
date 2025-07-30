using Microsoft.EntityFrameworkCore;
using ÇiçekDünyası.Domain.Entities;

namespace ÇiçekDünyası.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Flower> Flowers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).IsRequired();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Flower configuration
            modelBuilder.Entity<Flower>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ImageUrl).HasMaxLength(200);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DeliveryAddress).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.HasOne(e => e.User).WithMany(e => e.Orders).HasForeignKey(e => e.UserId);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Order).WithMany(e => e.OrderItems).HasForeignKey(e => e.OrderId);
                entity.HasOne(e => e.Flower).WithMany(e => e.OrderItems).HasForeignKey(e => e.FlowerId);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Admin user
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@cicekdunyasi.com",
                PasswordHash = "$2a$11$C6UzMDM.H6dfI/f/IKcEeO5r1r5rQxQ3rFQxQwQwQwQwQwQwQwQwW",
                Role = "Admin",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });

            // Sample flowers
            modelBuilder.Entity<Flower>().HasData(
                new Flower
                {
                    Id = 1,
                    Name = "Kırmızı Gül",
                    Description = "Aşkın ve tutkunun simgesi kırmızı güller",
                    Price = 25.00m,
                    ImageUrl = "/images/red-rose.jpg",
                    StockQuantity = 100,
                    IsAvailable = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Flower
                {
                    Id = 2,
                    Name = "Beyaz Lily",
                    Description = "Saflık ve masumiyetin simgesi beyaz zambaklar",
                    Price = 30.00m,
                    ImageUrl = "/images/white-lily.jpg",
                    StockQuantity = 80,
                    IsAvailable = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Flower
                {
                    Id = 3,
                    Name = "Sarı Papatya",
                    Description = "Neşe ve mutluluğun simgesi sarı papatyalar",
                    Price = 15.00m,
                    ImageUrl = "/images/yellow-daisy.jpg",
                    StockQuantity = 150,
                    IsAvailable = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Flower
                {
                    Id = 4,
                    Name = "Mor Orkide",
                    Description = "Zarafet ve güzelliğin simgesi mor orkideler",
                    Price = 45.00m,
                    ImageUrl = "/images/purple-orchid.jpg",
                    StockQuantity = 60,
                    IsAvailable = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Flower
                {
                    Id = 5,
                    Name = "Pembe Karanfil",
                    Description = "Sevgi ve şefkatin simgesi pembe karanfiller",
                    Price = 20.00m,
                    ImageUrl = "/images/pink-carnation.jpg",
                    StockQuantity = 120,
                    IsAvailable = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
} 