import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import {} from 'semantic-ui-react';

class Requests extends React.Component {
  static async getInitialProps(props) {
    const { address } = props.query

    return { address };
  }

  render() {
    return (
      <Layout>
          <Link href={`/campaigns/${this.props.address}/newrequest`}>asdf</Link>
      </Layout>
    );
  }
}

export default Requests;