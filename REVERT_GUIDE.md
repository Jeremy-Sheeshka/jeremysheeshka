# Revert Guide — MET Dashboard Migration

## Code Revert

To abandon all changes and return to the tagged safe point:

```bash
git reset --hard v1.0-pre-met-dashboard
git clean -fd
```

This discards **all uncommitted work**. Use with caution.

## Archive Restore

If you need to restore from the tarball backup:

```bash
tar -xzf <archive-name>.tar.gz -C <destination-directory>
```

The archive contains the full repo snapshot (minus node_modules, .next, dist, .astro, and .git).

## Manual Infrastructure Checklist

These steps require access to GUIs that cannot be automated from this script:

- [ ] **Proxmox:** Snapshot the VM/LXC I'll use for Coolify (skip if it doesn't exist yet — snapshot it when I create it)
- [ ] **Deployment platform (Netlify / GitHub Pages):** Export or screenshot all environment variables and the build settings
- [ ] **Cloudflare:** Screenshot the current DNS records for `jeremysheeshka.ca`
