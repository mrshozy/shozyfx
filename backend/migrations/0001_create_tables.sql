-- Create the user table
CREATE TABLE IF NOT EXISTS users
(
    id         VARCHAR(36)  NOT NULL,
    name       VARCHAR(255) NOT NULL,
    surname    VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(500) NOT NULL,
    verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    blocked    BOOLEAN      NOT NULL DEFAULT FALSE,
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_on DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_roles
(
    role_id     INT AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(255) NOT NULL,
    description VARCHAR(1000)
);


CREATE TABLE IF NOT EXISTS user_role_mapping
(
    user_id CHAR(36) NOT NULL,
    role_id INT      NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (role_id) REFERENCES user_roles (role_id)
);

CREATE TABLE IF NOT EXISTS user_profiles
(
    user_id         CHAR(36) NOT NULL,
    profile_picture VARCHAR(255),
    address         VARCHAR(255),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS password_reset_requests
(
    reset_token     VARCHAR(255) PRIMARY KEY,
    user_id         CHAR(36) NOT NULL,
    request_time    DATETIME,
    expiration_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
);