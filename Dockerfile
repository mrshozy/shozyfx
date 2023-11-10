# Stage 1: Build Rust Backend
FROM rust:1.72 as backend-builder
WORKDIR /app

# Copy the backend source code
COPY backend /app

# Build the backend
RUN cargo build --release

# Stage 2: Build ReactJS Frontend
FROM node:18 as frontend-builder
WORKDIR /app

# Copy the frontend source code
COPY frontend /app

# Install dependencies and build the frontend
RUN yarn install
RUN yarn run build

# Stage 3: Final Image
FROM rust:1.72
WORKDIR /app

# Copy the compiled backend binary
COPY --from=backend-builder /app/target/release/backend /app

WORKDIR /dist
# Copy dist build
COPY --from=frontend-builder /app/dist /dist

WORKDIR /app/migrations
# Copy dist build
COPY --from=backend-builder /app/migrations /app/migrations

# Expose the necessary port for the backend
EXPOSE 8080

WORKDIR /app

# Command to run your application
CMD ["./backend"]
