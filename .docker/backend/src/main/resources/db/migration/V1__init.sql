create table companies
(
    id            bigint ${identity_syntax},
    location_id   bigint,
    owner_id      bigint unique,
    profession_id bigint,
    company_type  varchar(255) check (company_type in ('MICRO', 'SMALL', 'MEDIUM', 'LARGE')),
    name          varchar(255),
    primary key (id)
);

create table counties
(
    federal_state_id bigint not null,
    id               bigint ${identity_syntax},
    code             varchar(255),
    name_            varchar(255) not null,
    primary key (id)
);

create table countries
(
    id    bigint ${identity_syntax},
    code  varchar(255),
    name_ varchar(255) not null unique,
    primary key (id)
);

create table federal_states
(
    country_id bigint not null,
    id         bigint ${identity_syntax},
    code       varchar(255),
    name_      varchar(255) not null,
    primary key (id)
);

create table glossary
(
    category_id bigint not null,
    created_at  timestamp(6),
    id          bigint ${identity_syntax},
    updated_at  timestamp(6),
    definition  TEXT,
    description TEXT,
    keyword     varchar(255),
    primary key (id)
);

create table glossary_categories
(
    id          bigint ${identity_syntax},
    description varchar(255) not null,
    name_       varchar(255) not null unique,
    primary key (id)
);

create table glossary_sources
(
    id      bigint ${identity_syntax},
    term_id bigint not null,
    name_   varchar(1000) not null,
    url     varchar(3000) not null,
    type_   varchar(255)  not null check (type_ in ('SOURCE', 'RESOURCE')),
    primary key (id)
);

create table glossary_synonyms
(
    term_id bigint not null,
    synonym varchar(255)
);

create table industries
(
    id      bigint ${identity_syntax},
    area    varchar(255),
    name    varchar(255),
    subarea varchar(255),
    primary key (id)
);

create table it_component
(
    id               bigint ${identity_syntax},
    parent_id        bigint,
    description      TEXT,
    long_description TEXT,
    name_            varchar(255),
    primary key (id)
);

create table it_component_alias
(
    company_id bigint not null,
    id         bigint ${identity_syntax},
    name       varchar(255) not null,
    primary key (id),
    constraint UK6gysidjmytsirakw3uhvb02fb unique (company_id, name)
);

create table it_component_asset
(
    company_id   bigint not null,
    component_id bigint not null,
    id           bigint ${identity_syntax},
    primary key (id),
    constraint UKgwtm82dtjhdhvl81xmfj4mn06 unique (company_id, component_id)
);

create table it_component_asset_alias
(
    alias_id           bigint not null,
    component_asset_id bigint not null,
    created_at         timestamp(6),
    id                 bigint ${identity_syntax},
    primary key (id)
);

create table it_component_asset_alias_tags
(
    asset_alias_id bigint not null,
    tag_id         bigint not null
);

create table it_component_controls
(
    component_id bigint not null,
    control_id   bigint not null
);

create table it_component_tag
(
    company_id bigint not null,
    id         bigint ${identity_syntax},
    name       varchar(255) not null,
    primary key (id),
    constraint UK1ixl4pur3cy0yhf5hlb7053rb unique (company_id, name)
);

create table it_control
(
    id               bigint ${identity_syntax},
    parent_id        bigint,
    description      TEXT,
    label            varchar(255),
    level            varchar(255) check (level in ('MUST', 'SHOULD')),
    long_description TEXT,
    name_            varchar(255),
    type             varchar(255) check (type in ('CORRECTIVE', 'DETECTIVE', 'DETERRENT', 'PREVENTIVE')),
    primary key (id)
);

create table it_control_asset
(
    recommended boolean not null,
    company_id  bigint not null,
    control_id  bigint not null,
    id          bigint ${identity_syntax},
    status      varchar(255) check (status in ('OPEN', 'IRRELEVANT', 'IN_PROCESS', 'IMPLEMENTED')),
    primary key (id),
    constraint UKifi9lbtobklafbru0etb84lkq unique (company_id, control_id)
);

create table it_control_asset_guideline
(
    control_asset_id bigint not null,
    guideline_id     bigint not null,
    id               bigint ${identity_syntax},
    primary key (id)
);

create table it_control_guidelines
(
    position    integer not null,
    control_id  bigint not null,
    id          bigint ${identity_syntax},
    description TEXT    not null,
    primary key (id)
);

create table it_control_threat
(
    id    bigint ${identity_syntax},
    label varchar(255) unique,
    name_ varchar(255),
    primary key (id)
);

create table it_control_threat_map
(
    control_id bigint not null,
    threat_id  bigint not null
);

create table jwt_token
(
    active      boolean      not null,
    expiry_date timestamp(6) not null,
    id          bigint ${identity_syntax},
    issued_at   timestamp(6) not null,
    user_id     bigint not null,
    token       varchar(255) not null unique,
    primary key (id)
);

create table locations
(
    county_id   bigint not null,
    id          bigint ${identity_syntax},
    name_       varchar(255) not null,
    postal_code varchar(255),
    primary key (id)
);

create table professions
(
    id    bigint ${identity_syntax},
    name_ varchar(255) not null,
    primary key (id)
);

create table roles
(
    id    bigint ${identity_syntax},
    label varchar(255) unique check (label in ('USER', 'OWNER', 'ADMIN')),
    primary key (id)
);

create table security_standard
(
    id          bigint ${identity_syntax},
    parent_id   bigint,
    description TEXT,
    name_       varchar(255),
    website     varchar(255),
    primary key (id)
);

create table security_standard_controls
(
    control_id bigint not null,
    element_id bigint not null
);

create table support_listing
(
    id          bigint ${identity_syntax},
    offer_id    bigint not null,
    provider_id bigint not null,
    website     varchar(255),
    primary key (id)
);

create table support_offer_topics
(
    offer_id bigint not null,
    topic_id bigint not null
);

create table support_offers
(
    id          bigint ${identity_syntax},
    description TEXT,
    name_       varchar(255),
    type        varchar(255) check (type in ('TRAINING', 'CONSULTATION')),
    primary key (id)
);

create table support_providers
(
    id              bigint ${identity_syntax},
    location_id     bigint not null,
    address_details varchar(255),
    contact_person  varchar(255),
    description     TEXT,
    mail            varchar(255),
    name_           varchar(255),
    phone           varchar(255),
    street          varchar(255),
    street_number   varchar(255),
    website         varchar(255),
    primary key (id)
);

create table support_topics
(
    id          bigint ${identity_syntax},
    description TEXT,
    name_       varchar(255) unique,
    primary key (id)
);

create table users
(
    verified   BOOLEAN DEFAULT FALSE not null,
    company_id bigint,
    id         bigint ${identity_syntax},
    first_name varchar(255),
    last_name  varchar(255),
    mail       varchar(255) unique,
    password   varchar(255),
    primary key (id)
);

create table users_to_roles
(
    role_id bigint not null,
    user_id bigint not null,
    primary key (role_id, user_id)
);

create table user_token
(
    active      boolean      not null,
    expiry_date timestamp(6) not null,
    id          bigint ${identity_syntax},
    issued_at   timestamp(6) not null,
    user_id     bigint not null,
    token       varchar(255) not null unique,
    type        varchar(255) not null check (type in ('VERIFICATION', 'PASSWORD_RESET')),
    primary key (id)
);

alter table if exists companies
    add constraint FKdr3p21hugqr6112d974o9gfws
    foreign key (location_id)
    references locations (id);

alter table if exists companies
    add constraint FKikhsc7na5r394c8jghny8b6t4
    foreign key (owner_id)
    references users (id);

alter table if exists companies
    add constraint FKbhsuqj4jpqn1dhk5s6wjeb7n9
    foreign key (profession_id)
    references professions (id);

alter table if exists counties
    add constraint FK2xcjdi4krvuq19eu3nf0gp2cr
    foreign key (federal_state_id)
    references federal_states (id);

alter table if exists federal_states
    add constraint FKlp2yuf6fdaosikr5vh2nmdu1v
    foreign key (country_id)
    references countries (id);

alter table if exists glossary
    add constraint FKf2huhgn3v3wofa7vgplkxaq75
    foreign key (category_id)
    references glossary_categories (id);

alter table if exists glossary_sources
    add constraint FK1vllp8hmkvvc64rxkudmoranh
    foreign key (term_id)
    references glossary (id);

alter table if exists glossary_synonyms
    add constraint FK8kc0oa2cgesbe76nnygwpx39v
    foreign key (term_id)
    references glossary (id);

alter table if exists it_component
    add constraint FKnv6h1p20r7mrsctlp2f60rcyc
    foreign key (parent_id)
    references it_component (id);

alter table if exists it_component_alias
    add constraint FKt7ir6xtqnm2pjtquxidnknjf6
    foreign key (company_id)
    references companies (id);

alter table if exists it_component_asset
    add constraint FKb8p1nus1e2al3cl1bxxm0btuu
    foreign key (company_id)
    references companies (id);

alter table if exists it_component_asset
    add constraint FK1a2py9igulhogpq8x8e9eptf5
    foreign key (component_id)
    references it_component (id);

alter table if exists it_component_asset_alias
    add constraint FKjyttx7bena7iq8lc2ybu7qp0p
    foreign key (alias_id)
    references it_component_alias (id);

alter table if exists it_component_asset_alias
    add constraint FKh0cjghoo4u1dhd7ux0pmltk81
    foreign key (component_asset_id)
    references it_component_asset (id);

alter table if exists it_component_asset_alias_tags
    add constraint FK3ji64k9w8jo4ua8vdsowdaqx
    foreign key (tag_id)
    references it_component_tag (id);

alter table if exists it_component_asset_alias_tags
    add constraint FK3qedo5biyep4f0bmoqirlo88q
    foreign key (asset_alias_id)
    references it_component_asset_alias (id);

alter table if exists it_component_controls
    add constraint FK81nuv449jrn9s7it6l6tyna7b
    foreign key (control_id)
    references it_control (id);

alter table if exists it_component_controls
    add constraint FKqh8srkg7d7undpfolof924f2g
    foreign key (component_id)
    references it_component (id);

alter table if exists it_component_tag
    add constraint FKysnmo83j6rseiw9lueb5gj7y
    foreign key (company_id)
    references companies (id);

alter table if exists it_control
    add constraint FK6pg55wju0k16eho0mk8iccny
    foreign key (parent_id)
    references it_control (id);

alter table if exists it_control_asset
    add constraint FKd6f4dbcvlqxnjuwojuw1c6fd4
    foreign key (company_id)
    references companies (id);

alter table if exists it_control_asset
    add constraint FKndnvn0juq42j2oe39fyx2uoav
    foreign key (control_id)
    references it_control (id);

alter table if exists it_control_asset_guideline
    add constraint FKjv0fqhqmi45ggb91nkw7iyfvx
    foreign key (control_asset_id)
    references it_control_asset (id);

alter table if exists it_control_asset_guideline
    add constraint FKpn0enj7qs2dv9s3h30bdefgle
    foreign key (guideline_id)
    references it_control_guidelines (id);

alter table if exists it_control_guidelines
    add constraint FKawomt8wbtpqy9wxuxq7hmt6hs
    foreign key (control_id)
    references it_control (id);

alter table if exists it_control_threat_map
    add constraint FKii8drg1m47102hkcnl152jr6w
    foreign key (threat_id)
    references it_control_threat (id);

alter table if exists it_control_threat_map
    add constraint FKbqn0gqxn6qtsornx7rwihps2b
    foreign key (control_id)
    references it_control (id);

alter table if exists jwt_token
    add constraint FKc8byj5reo1231wqon0fxk476w
    foreign key (user_id)
    references users (id)
    on
delete
cascade;

alter table if exists locations
    add constraint FKrbylm5fm3530rsfdbjr4jghv1
    foreign key (county_id)
    references counties (id);

alter table if exists security_standard
    add constraint FK4b58jy8t1bo6o8w99e0tfv6xa
    foreign key (parent_id)
    references security_standard (id);

alter table if exists security_standard_controls
    add constraint FK897yxwqarrm5wjd3unt1oyise
    foreign key (control_id)
    references it_control (id);

alter table if exists security_standard_controls
    add constraint FKk7o6uwtqyo4oqmuav0n662i2f
    foreign key (element_id)
    references security_standard (id);

alter table if exists support_listing
    add constraint FKjgj0uf6fg5ep7ep2684yuqd13
    foreign key (offer_id)
    references support_offers (id);

alter table if exists support_listing
    add constraint FKt19jmofhewuich1y41brq6wmn
    foreign key (provider_id)
    references support_providers (id);

alter table if exists support_offer_topics
    add constraint FKhtwffr1dao49dqx5huksspj4c
    foreign key (topic_id)
    references support_topics (id);

alter table if exists support_offer_topics
    add constraint FKb35hj9hni0u4jbi9ipqrqkyb2
    foreign key (offer_id)
    references support_offers (id);

alter table if exists support_providers
    add constraint FKg5gyogkfouju4bp5xa4ff7cso
    foreign key (location_id)
    references locations (id);

alter table if exists users
    add constraint FKin8gn4o1hpiwe6qe4ey7ykwq7
    foreign key (company_id)
    references companies (id);

alter table if exists users_to_roles
    add constraint FKoapb2199m0cu5gdwiy4xibqqu
    foreign key (role_id)
    references roles (id);

alter table if exists users_to_roles
    add constraint FKolk7a861hdu0lghxspabptiqj
    foreign key (user_id)
    references users (id)
    on
delete
cascade;

alter table if exists user_token
    add constraint FKfadr8tg4d19axmfe9fltvrmqt
    foreign key (user_id)
    references users (id)
    on
delete
cascade;
