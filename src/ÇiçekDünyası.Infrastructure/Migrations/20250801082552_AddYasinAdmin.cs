using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ÇiçekDünyası.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddYasinAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "PasswordHash", "Role", "Username" },
                values: new object[] { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "yasin@cicekdunyasi.com", true, "$2a$11$C6UzMDM.H6dfI/f/IKcEeO5r1r5rQxQ3rFQxQwQwQwQwQwQwQwQwW", "Admin", "yasin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
