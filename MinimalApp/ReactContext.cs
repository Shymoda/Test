using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MinimalApp
{
    public partial class ReactContext : DbContext
    {
        public virtual DbSet<Events> Events { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            #warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
            optionsBuilder.UseSqlServer(@"Server=SWINTREST\SQLEXPRESS;Database=React;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Events>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Event)
                    .HasColumnName("event")
                    .HasColumnType("nchar(100)");

                entity.Property(e => e.Time)
                    .HasColumnName("time")
                    .HasColumnType("nchar(10)");
            });
        }
    }
}