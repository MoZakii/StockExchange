using Microsoft.EntityFrameworkCore;
using StockExchange.Models;

namespace StockExchange.Data
{
    public class StockContext : DbContext
    {
        public StockContext(DbContextOptions<StockContext> options) : base(options)
        {
        }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<StockHistory> StockHistory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Stock>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<StockHistory>()
                .HasKey(h => h.Id);

        }
    }
}
