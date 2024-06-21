# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the .csproj and restore any dependencies
COPY CryptoPortfolioBackend/*.csproj ./
RUN dotnet restore

# Copy the rest of the application and build it
COPY CryptoPortfolioBackend/. ./
RUN dotnet publish -c Release -o out

# Use the official ASP.NET Core runtime image for the final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose the port on which the app will be running
EXPOSE 80

# Start the application
ENTRYPOINT ["dotnet", "CryptoPortfolioBackend.dll"]
