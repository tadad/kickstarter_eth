import React from 'react';
import Link from 'next/link';
import { Menu, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

function Header(props) {
  return (
    <Container>
      <nav style={{margin: "20px 0"}}>
        <Menu>
          <Menu.Item>
            <Link href='/'>
              Kickerstarter
            </Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Link href="/">
                Campaigns
              </Link>   
            </Menu.Item>
            <Menu.Item>
              <Link href='/campaigns/new'>
                +
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </nav>
      <main>
        {props.children}
      </main>
      <footer>
        <Menu>
          <Menu.Item>
            footer brah
          </Menu.Item>
        </Menu>
      </footer>
    </Container>
  );
}

export default Header;