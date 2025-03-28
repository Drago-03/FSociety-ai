{pkgs}: {
  channel = "stable-24.05";
  packages = with pkgs; [
    nodejs_20
    nodePackages.npm
    nodePackages.typescript
    nodePackages.vite
    git
  ];

  idx.extensions = [
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "bradlc.vscode-tailwindcss"
    "ms-vscode.vscode-typescript-next"
  ];

  idx.workspace = {
    name = "fsociety-ai";
    description = "FSociety AI Content Moderation System";
  };

  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };

  env = {
    NODE_ENV = "development";
  };
}