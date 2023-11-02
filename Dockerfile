# Stage 1: Build the ReactJS project
FROM node:18 as react-build
WORKDIR /app
COPY reactjs-project/package*.json ./
RUN npm install
COPY reactjs-project ./
RUN npm run build

# Stage 2: Build the Rust project and copy the ReactJS build
FROM rust:latest as rust-build
WORKDIR /app
COPY rust-project ./
RUN cargo build --release

# Stage 3: Create the final image and copy the ReactJS build
FROM debian:buster-slim
WORKDIR /app
COPY --from=rust-build /app/target/release/your-rust-binary .
COPY --from=react-build /app/build ./react-build
CMD ["./your-rust-binary"]
