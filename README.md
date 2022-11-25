<p align="center">
  <a href="https://www.medusa-commerce.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png" width="100" />
  </a>
</p>
<h1 align="center">
  Medusa Admin
</h1>
<p align="center">
Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/medusajs/medusa">
    <img src="https://circleci.com/gh/medusajs/medusa.svg?style=shield" alt="Current CircleCI build status." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Quickstart

Follow our [quickstart guide](https://docs.medusajs.com/quickstart/quick-start) to learn how to set up a Medusa server.


## Setting up Admin

1. **Clone this repository**
   ```
   git clone https://github.com/medusajs/admin medusa-admin
   cd medusa-admin
   ```
2. **Install dependencies**
   ```
   yarn install
   ```
3. **Start the development server**
   ```
   yarn start
   ```
4. **Go to [http://localhost:7000](http://localhost:7000)**

Back in your Medusa engine installation directory, you can create your own user for the admin by running:

```
medusa user -e some@email.com -p some-password
```
Alternatively, if you've seeded your server with our dummy data, you can use the following credentials:
```
admin@medusa-test.com // supersecret
```

### Features

You can learn about all of the ecommerce features that Medusa provides [in our documentation](https://docs.medusajs.com/introduction#features).

## Contributions

Please check [our contribution guide](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md) for details about how to contribute to both our codebase and our documentation.

## Repository structure

The Medusa repository is a mono-repository managed using Lerna. Lerna allows us to have all Medusa packages in one place, and still distribute them as separate NPM packages.

## Licensed

Licensed under the [MIT License](https://github.com/medusajs/medusa/blob/master/LICENSE)


## Community & Support

Use these channels to be part of the community, ask for help while using Medusa, or just learn more about Medusa:

- [Discord](https://discord.gg/medusajs): This is the main channel to join the community. You can ask for help, showcase your work with Medusa, and stay up to date with everything Medusa.
- [GitHub Issues](https://github.com/medusajs/medusa/issues): for sending in any issues you face or bugs you find while using Medusa.
- [GitHub Discussions](https://github.com/medusajs/medusa/discussions): for joining discussions and submitting your ideas.
- [Medusa Blog](https://medusajs.com/blog/): find diverse tutorials and company news.
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
