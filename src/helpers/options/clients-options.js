/*
    This file just contains enum , options , contains for Clients Part.
    Please follow naming convention :
    - Enum type :  <name>_<enum>.
    - Constants :  <uppercase_name>.
    - Session : <name>_<session>
 */

export const clients_options = {
  cache: {
    all_clients_setups: {
      key: 'all_clients_setup',
      expire_time: 30
    },
  }
}

export const campaign_action_options = {
  send_text_messages: 0,
  change_clients_rating: 1
}

export const sales_date_type_options = {
  all: 1,
  input_date_range: 2
}

export const member_type_options = {
  all: -1,
  member: 1,
  not_member: 2
}

export const first_visite_date_options = {
  first_visit_date: 1,
  client: 0
}

export const recommender_type_options = {
  recommender: 1,
  recommended_clients: 2
}

export const sex_options = {
  all: 0,
  male: 1,
  female: 2
}