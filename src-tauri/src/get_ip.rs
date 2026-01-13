use local_ip_address::list_afinet_netifas;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    NotFound,
    LocalIpError(#[from] local_ip_address::Error),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub fn get_ip() -> Result<String, Error> {
    let list = list_afinet_netifas()?;

    let ip = list
        .iter()
        .find(|(_, ip)| ip.to_string().starts_with("192.168."));

    match ip {
        Some((_, ip)) => Ok(ip.to_string()),
        None => Err(Error::NotFound),
    }
}
