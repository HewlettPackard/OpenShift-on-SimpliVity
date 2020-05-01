module.exports = {
  title: 'Red Hat OpenShift Container Platform on HPE SimpliVity',
  dest: '../openshift-docs-output/',
  base: '/OpenShift-on-SimpliVity/',  
  //base: '/openshift-on-simplivity/',   
  plugins: ['vuepress-plugin-export'], 
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' }
    ],

    algolia: {
      apiKey: process.env.VUE_APP_OPENSHIFT_ALGOLIA_APIKEY,
      indexName: process.env.VUE_APP_OPENSHIFT_ALGOLIA_INDEXNAME
    }

    repo: 'HewlettPackard/OpenShift-on-SimpliVity',
    // Customising the header label
    // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
    repoLabel: 'Contribute!',

    // Optional options for generating "Edit this page" link

    // if your docs are in a different repo from your main project:

    docsRepo: 'https://github.com/HewlettPackard/OpenShift-on-SimpliVity',
    // if your docs are not at the root of the repo:
    docsDir: 'docs-src',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'docs-dev',

    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Help us improve this page!',


    sidebar: [
      '/executive-summary',
 //     {
 //       title: 'Introduction',
 //      collapsable: true,
 //       children: [
 //         '/executive-summary'
 //       ]
 //    },
      {
        title: 'Release Notes',
        collapsable: true,
        children: [
          '/rel-notes/rel-notes',
          '/rel-notes/new-features',
          '/rel-notes/fixed-issues',
          '/rel-notes/known-issues'
        ]
      },
      {
        title: 'Solution overview',
        children: [
          'soln-overview/solution-overview',
          'soln-overview/containers-k8s-devops',
          'soln-overview/openshift-overview',
          'soln-overview/simplivity-overview',
          'soln-overview/solution-configuration',
          'soln-overview/solution-sizing',
          'soln-overview/high-availability',
          'soln-overview/playbooks'
        ]
      },   
      {
        title: 'Solution components',
        children: [
          'soln-components/hardware',
          'soln-components/software',
          'soln-components/application-software'
        ]
      },         
      {
        title: 'Preparing the environment',
        collapsable: true,
        children: [
          '/preparing/verify-prereqs',
          '/preparing/ansible-fedora',
          '/preparing/rhel',
          '/preparing/openshift-artifacts'           
        ]
      },
      {
        title: 'Configuring the solution',
        collapsable: true,
        children: [
          '/config-core/ansible-config',
          '/config-core/proxy-config',
          '/config-core/edit-hosts',
          '/config-core/vmware-config',
          '/config-core/simplivity-config',
          '/config-core/networking-config',
          '/config-core/redhat-config',
          '/config-core/openshift-config',
          '/config-core/lbs-config',   
          '/config-core/group-vars',             
          '/config-core/edit-vault',                         
          '/config-core/vars-sample',
          '/config-core/vault-sample'
        ]
      },  
      {
        title: 'Overview of the playbooks',
        collapsable: true,
        children: [
          '/playbooks/playbooks-overview',
          '/playbooks/initial-deployment',
          '/playbooks/redeploy.md'
        ]
      },
      {
        title: 'Post deployment tasks',
        collapsable: true,
        children: [
          '/post-deploy/post-deploy-intro',
          '/post-deploy/first-login',
          '/post-deploy/cluster-verification',
          '/post-deploy/example-app',
          '/post-deploy/external-routes',
          '/post-deploy/expose-registry',
          '/post-deploy/build-deploy-app',
          '/post-deploy/ldap',
          '/post-deploy/placement',
          '/post-deploy/sysdig'
        ]
      }, 
      {
        title: 'Configuring storage',
        collapsable: true,
        children: [
          '/storage/storage-intro.md',  
          '/storage/image-registry.md',
          '/storage/monitoring.md',
          '/storage/csi.md'
        ]
      },           
      {
        title: 'Adding worker nodes',
        collapsable: true,
        children: [
          '/worker-nodes/worker-intro',          
          '/worker-nodes/coreos',
          '/worker-nodes/rhel'
        ]
      },
      {
        title: 'Deploying cluster logging',
        collapsable: true,
        children: [
          '/logging/logging-intro',      
          '/logging/logging-config',               
          '/logging/logging-playbooks'//,
          //'/logging/logging-validate'
        ]
      },
      {
        title: 'Backup and restore',
        collapsable: true,
        children: [
          '/backup-restore/backup-restore-intro',      
          '/backup-restore/backup',               
          '/backup-restore/recovery-lost-master'
        ]
      },
      {
        title: 'Appendices',
        collapsable: true,
        children: [
          '/appendices/appendix-a',
          '/appendices/appendix-b'
        ]
      }                     
    ]
  }
}
