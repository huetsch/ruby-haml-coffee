# ruby-haml-coffee

ruby-haml-coffee wraps [haml-coffee](http://github.com/9elements/haml-coffee) to generate
JavaScript templates from HAML files using CoffeeScript instead of Ruby for the inline
code.

The following features are provided:

  * Basic compiler in `HamlCoffee.compile` to compile source directly to JavaScript
  * Template for [Tilt](https://github.com/rtomayko/tilt.git)
  * Rails Engine for use with the 3.1 asset pipeline

## As a Rails 3.1 Engine

To install, add ruby-haml-coffee to your Gemfile:

    group :assets do
      ...
      gem 'ruby-haml-coffee'
      ...
    end

Now create template files somewhere in `app/assets/javascripts` with the extension
`.js.haml-coffee`. Templates are added to the `window.HAML` object according to their
path. For example, `app/assets/javascripts/templates/user/show.js.haml-coffee` is accessible
through `window.HAML.templates.user.show`:

    //= require_tree ./templates

    $(function() {
      user = getCurrentUser();

      $(body).append(HAML.templates.user.show(user));
    });
