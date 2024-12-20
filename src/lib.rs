use anyhow::Result;
use spin_sdk::{
    http::{Request, Response},
    http_component,
};

/// A simple Spin HTTP component.
#[http_component]
fn handle_test(req: Request) -> Result<Response> {
    for header in req.headers() {
        println!("{}: {:?}", header.0, header.1);
    }
    Ok(Response::builder()
        .status(200)
        .header("foo", "bar")
        .body("Hello, Fermyon").build())
}
